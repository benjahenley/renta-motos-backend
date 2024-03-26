import test from "ava";
import { decode, generate } from "./jwt";

test("generate/decode token", (t) => {
  const payload = { mock: true };
  const token = generate(payload);
  const expected: any = decode(token);
  delete expected.iat;

  t.deepEqual(payload, expected);
});
