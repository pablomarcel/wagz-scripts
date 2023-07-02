require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

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
    let { id, name, fileUrl, bio, email } = body;

    // Log original email
    //console.log(`Original Email: ${email}`);

    // Convert email to lowercase
    const lowerEmail = email.toLowerCase();

    // Log lowercased email
    //console.log(`Lowercased Email: ${lowerEmail}`);

    // Create email hash
    const hash = crypto.createHash('sha256');
    hash.update(lowerEmail);
    const hashEmail = hash.digest('hex');

    // Log hashed email
    //console.log(`Hashed Email: ${hashEmail}`);

    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            const query = `
                CREATE (owner:PetOwner {id: $id, name: $name, hashEmail: $hashEmail, fileUrl: $fileUrl, bio: $bio})
                RETURN owner
            `;
            const params = {
                id: id,
                name: name,
                hashEmail: hashEmail,
                fileUrl: fileUrl,
                bio: bio,
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
