export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/privacy-policy",
      permanent: true,
    },
  };
}

export default function LegacyPrivacyRedirect() {
  return null;
}
