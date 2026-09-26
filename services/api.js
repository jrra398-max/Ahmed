export async function createOrder(order) {
  const response = await fetch(
    "/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Order request failed"
    );
  }

  return response.json();
}
