import express from 'express';

export default (app: express.Application | any, routes: any[]) => {
  for (const r of routes) {
    app.use(r);
  }
}
