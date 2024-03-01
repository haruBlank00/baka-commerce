import { FieldErrors, FieldValues } from "react-hook-form";
import invariant from "tiny-invariant";

/**
 * Normalizes a set of form validation errors into an array of objects with a standardized structure.
 *
 * @param {FieldErrors<FieldValues>} errors - Object with input field names as keys and corresponding error messages as values.
 * @returns {Record<string, string>[]} An array of objects, each containing a `name` (field name) and `message` (error message).
 * @throws {Error} Throws an error if any input field or its error message is missing.
 *
 * @example
 * // Example input:
 * const errors = {
 *   email: {
 *     message: "Please enter your email address"
 *   },
 *   password: {
 *     message: "Password must be at least 8 characters long"
 *   }
 * };
 *
 * // Example output:
 * const normalizedErrors = normalizeError(errors);
 * // normalizedErrors: [
 * //   { name: "email", message: "Please enter your email address" },
 * //   { name: "password", message: "Password must be at least 8 characters long" }
 * // ]
 */
export const normalizeError = <T>(errors: FieldErrors<FieldValues>) => {
  const normalizedErrors: Record<string, keyof T | string>[] = [];
  for (const error of Object.entries(errors)) {
    const [key, value] = error;

    invariant(key, "Key is missing.");
    invariant(value?.message, "Value is missing.");

    normalizedErrors.push({
      name: key,
      message: value.message as string,
    });
  }
  return normalizedErrors;
};
