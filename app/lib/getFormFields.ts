export async function getFormValues<T>(data: FormData | Request) {
  let formData = null;

  if (data instanceof Request) {
    formData = await data.formData();
  } else {
    formData = data;
  }

  const values: Record<string, unknown> = {};
  for (const [name, value] of formData.entries()) {
    values[name] = value;
  }
  return values as T;
}
