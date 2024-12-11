import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateEsewaForm, generateOrderId } from "@/lib/esewa";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, productName } = await req.json();

    const orderId = generateOrderId();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const esewaParams = {
      amount: amount,
      productId: orderId,
      successUrl: `${baseUrl}/api/payments/esewa/success`,
      failureUrl: `${baseUrl}/api/payments/esewa/failure`,
      productName: productName,
      totalAmount: amount,
    };

    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        amount: amount,
        paymentMethod: "ESEWA",
        transactionCode: orderId,
      },
    });

    const esewaForm = generateEsewaForm(esewaParams);

    return NextResponse.json({ 
      success: true, 
      payment,
      esewaForm,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}