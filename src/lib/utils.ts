export const asyncWrapper = async <T>(
  promise: Promise<T>,
  {
    onSuccess,
    onError,
    onFinally,
  }: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error | null) => void;
    onFinally?: () => void;
  } = {},
) => {
  try {
    const data = await promise;
    if (onSuccess) onSuccess(data);
    return data;
  } catch (error) {
    if (onError) onError(error as Error | null);
    return null;
  } finally {
    if (onFinally) onFinally();
  }
};
