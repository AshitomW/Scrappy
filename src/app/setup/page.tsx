import { SetupUser } from "@/actions/billing/SetupUser";
import { waitFor } from "@/lib/helpers/waitFor";

export default async function SetupPage() {
  return await SetupUser();
}
