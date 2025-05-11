import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Placement from '@/models/Placement';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { records } = await req.json();
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'No records provided' }, { status: 400 });
    }
    // Validate and sanitize records
    const sanitized = records.map((rec) => ({
      college: rec.college,
      year: Number(rec.year),
      branch: rec.branch,
      company: rec.company,
      ctc: Number(rec.ctc),
      count: Number(rec.count || rec.students || 1), // use count for number of students placed
      createdAt: rec.createdAt ? new Date(rec.createdAt) : new Date()
    }));
    await Placement.insertMany(sanitized);
    return NextResponse.json({ success: true, inserted: sanitized.length });
  } catch (error) {
    let message = 'Internal error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
