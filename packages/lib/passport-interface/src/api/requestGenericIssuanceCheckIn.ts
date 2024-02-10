import { SerializedPCD } from "@pcd/pcd-types";
import { SemaphoreSignaturePCD } from "@pcd/semaphore-signature-pcd";
import urlJoin from "url-join";
import {
  GenericIssuanceCheckInRequest,
  GenericIssuanceCheckInResponseValue
} from "../RequestTypes";
import { APIResult } from "./apiResult";
import { httpPostSimple } from "./makeRequest";

/**
 * Asks the server to checkIn in a ticket issued by the Generic Issuance
 * Service. {@link signedPayload} is a Semaphore Signature of a payload
 * that is a `JSON.stringify`-ed {@link GenericCheckinCredentialPayload}.
 *
 * Never rejects. All information encoded in the resolved response.
 */
export async function requestGenericIssuanceCheckIn(
  checkInUrl: string,
  signedPayload: SerializedPCD<SemaphoreSignaturePCD>
): Promise<GenericIssuanceCheckInResult> {
  return httpPostSimple(
    urlJoin(checkInUrl),
    async (resText) => {
      return {
        success: true,
        value: JSON.parse(resText) as GenericIssuanceCheckInResponseValue
      };
    },
    {
      credential: signedPayload
    } satisfies GenericIssuanceCheckInRequest
  );
}

export type GenericIssuanceCheckInResult =
  APIResult<GenericIssuanceCheckInResponseValue>;