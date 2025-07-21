
export interface LogoutReponseModel {
  success: boolean;
  message: string;
}


export type LogoutApiResponse = {
  success: true;
  message: "Request successful";
  data: LogoutReponseModel;
  statusCode: 200;
  errors: [];
};

