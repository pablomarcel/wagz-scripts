require('dotenv').config();
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const body = JSON.parse(event.body);

    const { description, buyButtonId, publishableKey, publicFigureId } = body;

    const id = uuidv4(); // Generate a new UUID for the product item

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (pf:PublicFigure {id: $publicFigureId})
            CREATE (pi:ProductItem {
                id: $id, 
                description: $description, 
                buyButtonId: $buyButtonId, 
                publishableKey: $publishableKey
            })
            CREATE (pf)-[:SELLS]->(pi)
            RETURN pi.id AS id, pi.description AS description, pf.name AS sellerName
            `,
            { id, description, buyButtonId, publishableKey, publicFigureId }
        );

        const createdProductItem = result.records.map(record => ({
            id: record.get('id'),
            description: record.get('description'),
            sellerName: record.get('sellerName'),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(createdProductItem),
        };
    } catch (error) {
        console.error('Neo4j operation error:', error); // Log the error for debugging.

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }), // Return the actual error message for debugging.
        };
    } finally {
        await session.close();
    }
};
