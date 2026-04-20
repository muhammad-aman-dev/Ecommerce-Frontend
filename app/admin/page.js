import { redirect } from 'next/navigation';
export default function Home() {
  const userIsLoggedIn = false; 

  if (!userIsLoggedIn) {
    redirect('/admin/login'); 
  }

  return <div>Redirecting....</div>;
}