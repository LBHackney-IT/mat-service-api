export default interface HackneyToken {
  sub: string;
  email: string;
  iss: string;
  name: string;
  groups: string[];
  iat: number;
}
