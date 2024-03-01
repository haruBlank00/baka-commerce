export async function getFormValues<T>(request: Request): Promise<T> {
  const form = await request.formData();
  const values: Record<string, unknown> = {};
  for (const [name, value] of form.entries()) {
    values[name] = value;
  }
  return values as T;
}
