import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  return NextResponse.json({ message: 'Minimal test route', id });
}
