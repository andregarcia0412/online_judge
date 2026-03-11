import request from 'supertest';

const API_URL = 'http://localhost:3000';
const N_EXECUTIONS = 30;
const CODE =
  'import java.util.*;class Main{public static void main(String[] args){Scanner sc = new Scanner(System.in);int a = sc.nextInt();int b = sc.nextInt();System.out.println(a+b);}}';
const LANGUAGE = 'java';
const TIMEOUT = 30000;

describe('Load and Concurrency Testing: POST /submission', () => {
  jest.setTimeout(TIMEOUT);

  it(`should process ${N_EXECUTIONS} submission in parallel and return "accepted" to all`, async () => {
    const payload = {
      id_user: '1035508b-734f-49f7-8330-1555104fb0cb',
      id_problem: 1,
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
      `🚀 Sending ${N_EXECUTIONS} simultaneous requisition to the judge...`,
    );
    const startTime = Date.now();

    const responses = await Promise.all(requests);

    const duration = Date.now() - startTime;
    console.log(`✅ All ${N_EXECUTIONS} executions finished in ${duration}ms`);

    responses.forEach((response, index) => {
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
