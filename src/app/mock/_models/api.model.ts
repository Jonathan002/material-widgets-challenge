export class MockResponse {
  constructor(
    public body,
    public status = 200,
    public statusText = 'OK',
    public url?,
    public headers?,
  ) {}
}
