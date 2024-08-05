import { SESClient } from "@aws-sdk/client-ses";
import { fromEnv } from "@aws-sdk/credential-providers";

const REGION = "us-east-2";

const sesClient = new SESClient({
  region: REGION,
  credentials: fromEnv(),
});

export { sesClient };
