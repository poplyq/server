export type UserInfoImg = {
  body: {
    id: number;
  };
  files: {
    img: any;
  };
};
export type UserInfo = {
 id: number; firstName: string; lastName: string ;
};
export type UserInfoRequest = {
  body: UserInfo;
};
