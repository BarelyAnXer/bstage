export const CAPIVisualizer = () => {

  return (
    <>
         <iframe
            src="http://localhost:8081/"
            width="100%"
            height="820"
            style={{ border: "1px solid black" }}
            title="Embedded Website"
          ></iframe>
    </>
  );
};

export default CAPIVisualizer;