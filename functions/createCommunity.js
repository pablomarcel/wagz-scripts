require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    //console.log("Received event: ", event); // Log the received event

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body);
    const { ownerId, name, about, fileUrl, tags } = body;

    //console.log("Parsed request body: ", body); // Log the parsed body

    const session = driver.session();

    //console.log(`Verifying existence of ownerId: ${ownerId}`);
    const verifyOwnerIdQuery = `
        MATCH (owner:PetOwner) WHERE owner.id = $ownerId RETURN owner
    `;
    const verifyOwnerIdResult = await session.run(verifyOwnerIdQuery, { ownerId });
    //console.log(`Verification result: ${JSON.stringify(verifyOwnerIdResult.records)}`);

    try {
        const result = await session.writeTransaction(async (tx) => {
            //console.log("Executing write transaction..."); // Log start of transaction

            const query = `
                MATCH (owner:PetOwner) WHERE owner.id = $ownerId
                CREATE (community:Community {id: $id, name: $name, about: $about, fileUrl: $fileUrl})-[:CREATED_BY]->(owner)
                RETURN community
            `;
            const params = { id: uuidv4(), ownerId, name, about, fileUrl };
            const response = await tx.run(query, params);
            //console.log("Response from Cypher query: ", response);
            const community = response.records[0].get('community').properties;

            //console.log("Created community: ", community); // Log the created community

            // Handle tags, if any
            if (tags) {
                for (const tagName of tags) {
                    // Check if tag already exists, otherwise create a new one
                    const tagExists = await tx.run(`
                        MATCH (t:Tag {name: $tagName})
                        RETURN t
                    `, { tagName });

                    if (!tagExists.records.length) {
                        await tx.run(`
                            CREATE (t:Tag {name: $tagName})
                        `, { tagName });
                    }

                    // Create a relationship from the community to the tag
                    await tx.run(`
                        MATCH (c:Community {id: $communityId})
                        MATCH (t:Tag {name: $tagName})
                        MERGE (c)-[:TAGGED_AS]->(t)
                    `, { communityId: community.id, tagName });
                }
            }

            return community;
        });

        //console.log("Write transaction executed successfully, result: ", result); // Log end of transaction

        return { statusCode: 201, body: JSON.stringify(result) };
    } catch (error) {
        console.error("Error during transaction: ", error); // Log error

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while adding the community.', details: error.message }),
        };
    } finally {
        await session.close();
        console.log("Session closed."); // Log session closure
    }
};
