require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

// Replace with your Neo4j Aura connection credentials
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body);
    let { name, fileUrl, bio, hashEmail } = body;

    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            const query = `
                CREATE (owner:PetOwner {id: $id, name: $name, hashEmail: $hashEmail, fileUrl: $fileUrl, bio: $bio})
                RETURN owner
            `;
            const params = {
                id: uuidv4(),
                name: name,
                hashEmail: hashEmail,
                fileUrl: fileUrl,
                bio: bio
            };
            const response = await tx.run(query, params);
            return response.records[0].get('owner').properties;
        });


        return { statusCode: 201, body: JSON.stringify(result) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'An error occurred while creating the pet owner.' }) };
    } finally {
        await session.close();
    }
};
