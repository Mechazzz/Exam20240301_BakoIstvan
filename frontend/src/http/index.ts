import { z } from "zod";

type Response<Type> =
  | {
      success: true;
      status: number;
      data: Type;
    }
  | {
      success: false;
      status: number | null;
      error?: unknown;
    };

type Methods = "GET" | "POST" | "PATCH" | "DELETE";

export const safeFetch = async <Schema extends z.ZodTypeAny>(
  method: Methods,
  url: string,
  schema: Schema,
  payload?: any
): Promise<Response<z.infer<typeof schema>>> => {
  try {
    const response = await fetch(url, {
      method,
      headers: payload
        ? {
            "Content-Type": "application/JSON",
          }
        : {},
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (response.status >= 500)
      return { success: false, status: response.status };

    if (response.status >= 400)
      return { success: false, status: response.status };

    const data = await response.json();

    const result = schema.safeParse(data);
    if (!result.success) return { success: false, status: response.status };

    return { data: result.data, success: true, status: response.status };
  } catch (error) {
    return { success: false, status: null, error };
  }
};

export const RegistrationSchema = z.object({
  email: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
});
