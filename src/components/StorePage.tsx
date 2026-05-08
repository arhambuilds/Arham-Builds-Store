import StoreGeneric from './StoreGeneric';

export default function StorePage() {
  return (
    <StoreGeneric 
      title="TEMPLATE STORE"
      subtitle="Premium Digital Solutions"
      description="Premium website templates designed for special moments and unique visions."
      excludeCategories={['Freebies', 'Editing Assets']}
    />
  );
}
