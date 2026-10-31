import { Label } from "../ui";

type Props = {
  id: string;
  message: string;
};

export function FormError({ id, message }: Props) {
  return (
    <Label
      id={id}
      className="mt-1 "
      role="alert"
    >
      {message}
    </Label>
  );
}
