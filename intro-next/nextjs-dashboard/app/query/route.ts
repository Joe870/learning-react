import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
  try {
    console.log('querying database');
    const data = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
  console.log('query result:', data);
	return data;
  } catch (error) {
    console.error('database query error:', error);
    throw error; 
  }
}

export async function GET() {
  try{
    const invoices = await listInvoices();
    return new Response(JSON.stringify(invoices), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('error in GET function:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown erro';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
