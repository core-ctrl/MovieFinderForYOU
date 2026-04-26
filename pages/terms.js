export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/terms-and-conditions",
      permanent: true,
    },
  };
}

export default function LegacyTermsRedirect() {
  return null;
}
