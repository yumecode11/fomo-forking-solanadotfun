"use client";

import { useContext } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, CardBody, Card} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import Logo from "@/app/assets/images/logo_color.svg";

import { ModalContext } from "@/app/providers";

export default function Modals() {
  const modalContext = useContext(ModalContext);

  return (
    <div>
      <Modal isOpen={modalContext?.openModals.includes("alertModal")} onOpenChange={() => modalContext?.setOpenModals((prev: any) => prev.filter((modal: any) => modal !== "alertModal"))}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 inter">Alerts</ModalHeader>
              <ModalBody>
                <p className="inter"> 
                  You will be able to set alerts in the single chart view.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button  className="inter" color="primary" onPress={onClose}>
                  Got it!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalContext?.openModals.includes("howItWorksModal")}
        onOpenChange={() => modalContext?.setOpenModals((prev: any) => prev.filter((modal: any) => modal !== "howItWorksModal"))}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 inter"></ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-center w-full">
                  <Image src={Logo.src} alt="Logo" width={150} height={150} />
                </div>
                <p className="inter"> 
                  FOMO 3D is a platform that allows you to buy and sell tokens that are launching on Solana. You can use the platform to buy and sell tokens, and to set alerts for when the price of a token is going to change.
                </p>

                <div className="bg-black/20 p-4 rounded-xl inter text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac cursus diam. Curabitur ullamcorper imperdiet risus, sit amet efficitur massa venenatis a. Morbi interdum fringilla eros. Integer vestibulum rutrum eros, a elementum justo rhoncus ut. Nullam ac turpis in metus congue imperdiet.
                </div>
              </ModalBody>
              <ModalFooter>
                <Button  className="inter" color="primary" onPress={onClose}>
                  Got it!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
