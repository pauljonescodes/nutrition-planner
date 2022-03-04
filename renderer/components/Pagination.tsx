import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ButtonGroup, IconButton, Text } from "@chakra-ui/react";
import { Fragment } from "react";

interface PaginationProps {
  onSetPage: (page: number) => void;
  page: number;
  pages: number;
}

export function Pagination(props: PaginationProps) {
  return (
    <Fragment>
      <ButtonGroup>
        <IconButton
          icon={<ArrowLeftIcon />}
          aria-label="Go to first page"
          onClick={() => {
            props.onSetPage(0);
          }}
          disabled={props.page === 0}
        />
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Go to previous page"
          onClick={() => {
            props.onSetPage(props.page - 1);
          }}
          disabled={props.page === 0}
        />
      </ButtonGroup>
      <Text px="3">
        {props.page + 1} / {props.pages + 1}
      </Text>
      <ButtonGroup>
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Go to next page"
          onClick={() => {
            props.onSetPage(props.page + 1);
          }}
          disabled={props.page === props.pages}
        />
        <IconButton
          icon={<ArrowRightIcon />}
          aria-label="Go to last page"
          onClick={() => {
            props.onSetPage(props.pages);
          }}
          disabled={props.page === props.pages}
        />
      </ButtonGroup>
    </Fragment>
  );
}
