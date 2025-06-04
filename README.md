#### How to Run the Backstage Project

1. **Prerequisites**

   - Node.js (v22.11.0)
   - Yarn (v4.4.1)
   - kind (v0.29.0)

2. **Clone the Git Repositories**

   ```bash
   git clone https://github.com/BarelyAnXer/bstage
   git clone https://github.com/Jont828/cluster-api-visualizer.git
   ```

3. **Create a Kind Cluster**

   ```bash
   kind create cluster
   ```

4. **Install K0rdent on the cluster**

   ```bash
   helm install kcm oci://ghcr.io/k0rdent/kcm/charts/kcm --version 1.0.0 -n kcm-system --create-namespace

   # verify installation  
   
   ```

5. **Deploy CAPI Visualizer**

   ```bash
   cd cluster-api-visualizer

   ./hack/deploy-repo-to-kind.sh
   ```

6. **Install the dependencies for bstage**

    ```bash
    cd bstage
    yarn install
    ```

7. **Update Environment Variables**

   - Copy `.env.example` to `.env` and replace the placeholder with your GitHub token.

8. **Run the App**

   ```bash
   yarn start
   ```

9. **Verify Application**
    Now that the server is running, we can access backstage app here:
    http://localhost:3000/
