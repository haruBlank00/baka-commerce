import { Modal } from "~/components/ui/modal";
import { StoreInfo } from "./store-info";
import { Form, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Store } from "@prisma/client";

type StoreListModalProps = {
  showStoreList: boolean;
  setShowStoreList: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => void;
  stores: Store[];
};

export const StoreListModal = ({
  showStoreList,
  setShowStoreList,
  onClick: onBtnClick,
  stores,
}: StoreListModalProps) => {
  const navigate = useNavigate();

  const onClick = (storeId: string) => {
    navigate(`/${storeId}/dashboard`);
  };

  return (
    <Modal
      onOpenChange={setShowStoreList}
      title="Create a new Store"
      description="Add the name and other details of your new store :)"
      isOpen={showStoreList}
      footer={() => {
        return (
          <Button className="w-full" onClick={() => onBtnClick()}>
            Create a new Store
          </Button>
        );
      }}
    >
      {stores.map((store) => (
        <StoreInfo
          key={store?.id}
          onClick={() => onClick(store?.id)}
          name={store?.name}
          imageSrc=""
        />
      ))}
    </Modal>
  );
};
