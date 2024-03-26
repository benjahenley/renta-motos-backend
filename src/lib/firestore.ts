import admin from "firebase-admin";

const firebaseConfig = {
  type: "service_account",
  project_id: "renta-motos-backend-f471c",
  private_key_id: "2fd1f7c3e8bd3f541ff843c99b838cd6f91b7225",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDp08pdV6MfXvXz\n8tyRtCt9+a2ajQK5UKOAxWmyccI0iRkfW/Ij3g9loUJlUV+Iaglfb0/1BbRu/8HZ\nPjpVeB6Iyc0dz44e2a7JQaG9iLDq8Zgz6u2nyWvH+zWdD88Z0BhRtzVAMQccM1eN\nWRnDaQdwYBILRUxyhlPAYKxhXQZPaJ/mQn573vCTkdj2fWa2YNPQn0Xbih2KLxrv\nHJ5JnSIbbbag4Un97+04Sd6iP69EA+Y7biYbuHlttdUl2w1WSeLaZubf55eq2VS4\nuKyjmXLihAkz2+nbAYmZp81ZQxXYl6Z0ILP9JdANVMcV1iSHSZyXwLMnKZT2ltTn\nMg+HyyW3AgMBAAECggEAC4F6ljWUlxvBnNjo+0RzKsDpRs8Z1guT7WdevZifwUez\nvu7JJJ8DK/GPm6kG5eat17ku+olm07AYa6ZbvCPr1g2etGZSVyNIA1WMQ2V2qyuV\n3TbPWJpuiB8iMrx56N/BVUK0x0KtAmQRB/6ykq0tirKM1hV5Xwiha2MhEwNppujm\nIH/wudYkGDjbPj6L8Z47emFt2H5/c+um/R2UHCcXLt9SWFZBp5byuPZXJNMro+ZF\nBB+Zs+raLZrHANikfHf8bZMCYFMxNNGHreIjazNe88MtLShOjIP030ihuUVFlFQO\nXnyk6558LLZ9GGmG0cvg3rp//OW+l4l5Td4PBdimgQKBgQD7OIR+9MfqCpDcgcFJ\nk9pyWjS2lsRH2EEpbTKnsV9Z99HHlWgcK+D8G0AuKOWaNT7DtOoK+rdF4DdnpfQ/\nHRnZJN1raFKWoVcWZiNxI/MYDiFzXwvlXgzhn0QXwv8FNBSEVtYM3O8PiYt7cV1o\nbGFa95jtg9hAwNu7gQ1KjgPyNwKBgQDuRpBtVVptj1hgngf6CLlxg/+O/zSG0gFm\nUBu+3K5LjIchksZ1vctILaMoFEwxXaHGqQaMLvjOOPd6zMKX47ThxjMM4pzViK0j\nLh7Y0u1TPOWnLTidr9BcM0SM79ncd1hh74n4CXAtHAuEVJoH+9bU4zf5wvyWYWnL\n07e0YPaogQKBgDSlZW7NkU+Eo1LyhjULHQ41xTI2ai+8K/uofKMT0q2h935h2w18\nTIvIkiyaOXOVkO+mbB2c6Odl03aPGp5XVOFijlxB4nzalsuE4AyHwhvaajwpQO7y\nRLTLkZOBM7w9a8dIA1dyvU5+PpLB8Rc/Dy/nD09G//yh7epfYw+qrz0FAoGBAJ6K\nSRLWVeLMHAu9WqVdJLaJE4O7/uEt3kyLRMrL3xTZnhgSpwY0kIuoAgVq6/90w22B\njZ+8qUPd15zXnSqfEf2feNw79AqIdFsSFuhCADMAM/X2OtOA5exTGGuGM7ljl2Ui\nkvR8oy0AmhEkkZB6WskvnlELEjGlA1XhuzvDwJsBAoGBAMsngLFAXH7tvdAXeKzi\nBhyWA8rcqQPpYcxdB9ssumhKW+IEr27+6zGU2J6Nc+jgNlFQ+CUuL0K1QqluqHKW\nqJhzkKYKjvngxORmsLa37oQqqEm51Hdkx/mJVNVoCQlFLFEJd4tJC9I643NG6Uv5\n2Mvyo/Lws3LEDcMqpG9XMiFI\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-731np@renta-motos-backend-f471c.iam.gserviceaccount.com",
  client_id: "110368587465937342830",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-731np%40renta-motos-backend-f471c.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// const serviceAccount = JSON.parse(firebaseConfig);

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig as any),
  });
}

export const firestore = admin.firestore();
