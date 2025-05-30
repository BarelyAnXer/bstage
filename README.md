#### How to Run the Backstage Project

1. **Prerequisites**
    - Node.js (v22.11.0)
    - Yarn (v4.4.1)

2. **Clone the Repository**

    ```bash
    git clone https://github.com/BarelyAnXer/bstage
    cd bstage
    yarn install
    ```

3. **Create Kind Cluster**

    ```bash
    kind create cluster
    ```

4. **Install K0rdent**

    ```bash
    helm install kcm oci://ghcr.io/k0rdent/kcm/charts/kcm --version 0.2.0 -n kcm-system --create-namespace
    # Installs KCM into the Kind cluster
    ```

5. **Clone and Deploy CAPI Visualizer**

    ```bash
    git clone https://github.com/Jont828/cluster-api-visualizer.git
    cd cluster-api-visualizer
    ./hack/deploy-repo-to-kind.sh
    # Installs to Kind cluster; keep it running
    ```

6. **Update Environment Variables**
    - Copy `.env.example` to `.env` and replace the placeholder with your GitHub token.

7. **Run the App**

    ```bash
    yarn start
    ```

    > **Note:** The CAPI Visualizer must be running.
