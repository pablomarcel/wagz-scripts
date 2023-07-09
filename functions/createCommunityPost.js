require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body);
    const { communityId, ownerId, caption, fileUrl, tags } = body;

    const session = driver.session();

    try {
        const result = await session.writeTransaction(async (tx) => {
            // Execute write transaction for creating the CommunityPost node
            const query = `
                MATCH (owner:PetOwner) WHERE owner.id = $ownerId
                MATCH (community:Community) WHERE community.id = $communityId
                CREATE (post:CommunityPost {id: $id, caption: $caption, fileUrl: $fileUrl})
                CREATE (owner)-[:POSTED]->(post)
                CREATE (post)-[:ABOUT]->(community)
                RETURN post
            `;
            const params = { id: uuidv4(), communityId, ownerId, caption, fileUrl };
            const response = await tx.run(query, params);
            const communityPost = response.records[0].get('post').properties;

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

                    // Create a relationship from the post to the tag
                    await tx.run(`
                        MATCH (p:CommunityPost {id: $postId})
                        MATCH (t:Tag {name: $tagName})
                        MERGE (p)-[:TAGGED_AS]->(t)
                    `, { postId: communityPost.id, tagName });
                }
            }

            return communityPost;
        });

        return { statusCode: 200, body: JSON.stringify(result) };
    } catch (error) {
        console.error('Error creating community post:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    } finally {
        session.close();
    }
};
