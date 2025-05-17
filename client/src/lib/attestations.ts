/**
 * Client-side utilities for working with blockchain attestations
 */
import { apiRequest } from "./queryClient";
import { Attestation } from "@shared/schema";

/**
 * Get all attestations
 * 
 * @returns Array of all attestations
 */
export async function getAllAttestations(): Promise<Attestation[]> {
  try {
    const response = await apiRequest('GET', '/api/attestations');
    return await response.json();
  } catch (error) {
    console.error('Error getting attestations:', error);
    throw new Error('No se pudieron obtener las certificaciones');
  }
}

/**
 * Get attestations for a specific user
 * 
 * @param userId User ID to get attestations for
 * @returns Array of attestations for the user
 */
export async function getUserAttestations(userId: number): Promise<Attestation[]> {
  try {
    const response = await apiRequest('GET', `/api/attestations/user/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting user attestations:', error);
    throw new Error('No se pudieron obtener las certificaciones del usuario');
  }
}

/**
 * Issue an attestation on the blockchain
 * 
 * @param attestationId The attestation ID to issue
 * @param walletAddress The recipient wallet address
 * @returns The updated attestation with transaction info
 */
export async function issueAttestation(
  attestationId: number, 
  walletAddress: string
): Promise<Attestation> {
  try {
    const response = await apiRequest(
      'POST',
      `/api/attestation/${attestationId}/issue`,
      { walletAddress }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error issuing attestation on blockchain:', error);
    throw new Error('No se pudo emitir la certificación en blockchain');
  }
}

/**
 * Get the verification URL for an attestation on Base blockchain explorer
 * 
 * @param transactionId The blockchain transaction ID
 * @returns The verification URL
 */
export function getVerificationUrl(transactionId: string): string {
  if (!transactionId) return '';
  return `https://basescan.org/tx/${transactionId}`;
}

/**
 * Format a skill array into a human-readable string
 * 
 * @param skills Array of skill strings
 * @returns Comma-separated string of skills
 */
export function formatSkills(skills: string[]): string {
  return skills.join(', ');
}

/**
 * Get the status label for an attestation status
 * 
 * @param status The attestation status
 * @returns A human-readable label in Spanish
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'issued':
      return 'Emitida';
    case 'revoked':
      return 'Revocada';
    default:
      return 'Desconocido';
  }
}

/**
 * Check if the current user can issue an attestation
 * 
 * @param attestation The attestation to check
 * @param currentUserId The current user's ID
 * @returns Whether the current user can issue this attestation
 */
export function canIssueAttestation(attestation: Attestation, currentUserId: number): boolean {
  // In a real system, this would check for admin or issuer role
  // For simplicity, we allow if:
  // 1. It's pending
  // 2. It doesn't already have a transaction ID
  // 3. The current user is the user for which the attestation was created (simulation only)
  return (
    attestation.status === 'pending' &&
    !attestation.transactionId &&
    attestation.userId === currentUserId
  );
}
