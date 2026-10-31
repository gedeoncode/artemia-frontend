export const POST = async (req: Request) => {
  console.log("🔥 POST HIT"); // add this
  const body = await req.json();
  console.log("BODY:", body);
};