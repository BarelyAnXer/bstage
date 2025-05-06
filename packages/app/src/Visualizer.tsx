import { Grid } from '@material-ui/core';
import { Content, Header, Page } from '@backstage/core-components';

export const Visualizer = () => {
  return (
    <Page themeId="tool">
      <Header title="My New Page" subtitle="This is my custom page" />
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <h1>Welcome to my new page!</h1>
            <p>This is custom content for my new page.</p>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};