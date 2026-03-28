import request from 'supertest';

const API_URL = 'http://localhost:3000';
const N_EXECUTIONS = 30;
const CODE =
  'import java.util.*;class Main{public static void main(String[] args){Scanner sc=new Scanner(System.in);int n=sc.nextInt();System.out.println(fib(n));}public static int fib(int n){if(n==0){return 0;}if(n==1){return 1;}return fib(n-1)+fib(n-2);}}';
const LANGUAGE = 'java';
const TIMEOUT = 3000000;
const ID_PROBLEM = 1;
describe.skip('Load and Concurrency Testing: POST /submission', () => {
  jest.setTimeout(TIMEOUT);

  it(`should process ${N_EXECUTIONS} submission in parallel and return "accepted" to all`, async () => {
    const payload = {
      id_user: '392d966c-f6be-4143-b90a-cb828d88f177',
      id_problem: ID_PROBLEM,
      text: CODE,
      language: LANGUAGE,
    };

    const requests = Array.from({ length: N_EXECUTIONS }, () =>
      request(API_URL)
        .post('/submission')
        .send(payload)
        .set('Accept', 'application/json'),
    );

    console.log(
      `🚀 Sending ${N_EXECUTIONS} simultaneous requisitions to the judge...`,
    );
    const startTime = Date.now();

    const responses = await Promise.all(requests);

    const duration = Date.now() - startTime;
    console.log(`✅ All ${N_EXECUTIONS} executions finished in ${duration}ms`);
    responses.forEach((response, index) => {
      if (response.body.status !== 'accepted') {
        console.log(`❌ Rejected #${index}. Error: ${response.body.error}`);
      }
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('accepted');
      expect(response.body.error).toBeNull();

      if (response.body.execution_time > 500) {
        console.warn(
          `⚠️ Warning: The requisition ${index} had a high execution_time: ${response.body.execution_time}ms`,
        );
      }
    });
  });
});
