import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  token: string;
  method: "EMAIL_OTP" | "MAGIC_LINK";
  url: string;
}

export function VerificationEmail({
  token,
  method,
  url,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={heading}>Verify your email address</Text>
            {method === "EMAIL_OTP" ? (
              <>
                <Text style={text}>Your verification code is:</Text>
                <Text style={code}>{token}</Text>
                <Text style={text}>
                  Enter this code on the verification page to confirm your email address.
                </Text>
              </>
            ) : (
              <>
                <Text style={text}>
                  Click the button below to verify your email address:
                </Text>
                <Button style={button} href={url}>
                  Verify Email
                </Button>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
  margin: "0 auto",
  padding: "45px",
  width: "465px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "15px",
};

const code = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "20px 0",
  padding: "12px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
};