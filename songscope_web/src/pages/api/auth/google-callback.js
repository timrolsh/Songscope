// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (request, response) => {
    response.setHeader("Set-Cookie", `token=${request.body.credential}; path=/;`);
    response.redirect(307, "/user");
};
