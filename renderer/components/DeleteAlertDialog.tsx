import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { LegacyRef, useRef } from "react";

type IngredientDrawerProps = {
  isOpen: boolean;
  onResult(result: boolean): void;
};

export function DeleteAlertDialog(props: IngredientDrawerProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  // const items = useRxCollection<ItemDocument>("items");

  return (
    <AlertDialog
      isOpen={props.isOpen}
      onClose={() => props.onResult(false)}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete Item</AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <ButtonGroup>
              <Button
                onClick={() => {
                  props.onResult(false);
                }}
                ref={cancelRef as LegacyRef<HTMLButtonElement>}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  props.onResult(true);
                }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
