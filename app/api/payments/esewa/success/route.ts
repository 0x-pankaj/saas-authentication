import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyEsewaPayment } from "@/lib/esewa";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const refId = searchParams.get("refId");
    const amt = searchParams.get("amt");
    const oid = searchParams.get("oid");

    if (!refId || !amt || !oid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const verification = await verifyEsewaPayment(
      refId,
      parseFloat(amt),
      oid
    );

    if (!verification.verified) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const payment = await db.payment.update({
      where: { transactionCode: oid },
      data: { status: "COMPLETED" },
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}