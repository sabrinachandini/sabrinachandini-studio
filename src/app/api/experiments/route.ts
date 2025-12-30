import { NextResponse } from 'next/server';
import { getExperiments } from '@/lib/content';

export async function GET() {
  const experiments = await getExperiments();
  return NextResponse.json(experiments);
}
