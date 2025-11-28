import { NextRequest, NextResponse } from "next/server";

type SummaryResult = {
  summaryPoints: string[];
  suggestedTasks: string[];
};

export async function POST(req: NextRequest) {
  const { notes } = (await req.json()) as { notes: string };

  if (!notes || typeof notes !== "string") {
    return NextResponse.json(
      { error: "Missing notes" },
      { status: 400 }
    );
  }

  // TODO: Replace with real AI provider call using GEMINI_API_KEY or similar.
  const result: SummaryResult = {
    summaryPoints: [
      "Stubbed summary – wire this endpoint to an AI provider."
    ],
    suggestedTasks: [
      "Example suggested task derived from notes."
    ]
  };

  return NextResponse.json(result);
}
