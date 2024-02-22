import {
  Button,
  Center,
  Input,
  Table,
  TableContainer,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import { useTranslation } from 'react-i18next';
import { RxNPItemDocument } from '../data/rxnp/RxNPItemSchema';
import { ServingOrTotalEnum } from '../data/interfaces/ServingOrTotalEnum';
import { ItemTableRow } from './ItemTableRow';

export function ItemInfiniteTableContainer(props: {
  nameSearch: string;
  emptyStateText?: string;
  onNameSearchChange: (value: string) => void;
  servingOrTotal: ServingOrTotalEnum;
  onToggleServingOrTotal?: () => void;
  documents?: RxNPItemDocument[] | undefined;
  isFetching: boolean;
  isExhausted: boolean;
  fetchMore: () => void;
  onEdit: (value: RxNPItemDocument) => void;
  onDelete: (value: RxNPItemDocument) => void;
}) {
  const {
    nameSearch,
    emptyStateText,
    onNameSearchChange,
    servingOrTotal,
    onToggleServingOrTotal,
    documents,
    isFetching,
    isExhausted,
    fetchMore,
    onEdit,
    onDelete,
  } = props;

  const subtleTextColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const { t } = useTranslation();

  return (
    <>
      <TableContainer className="hide-scrollbar">
        <Table>
          <Thead>
            <Tr>
              <Th width="144px">{t('actions')}</Th>
              <Th width="496px">
                <Input
                  placeholder={t('name')}
                  value={nameSearch}
                  onChange={(e) => {
                    onNameSearchChange(e.currentTarget.value);
                  }}
                  size="sm"
                  variant="unstyled"
                />
              </Th>
              <Th isNumeric>
                <Button
                  variant="ghost"
                  textTransform="uppercase"
                  size="xs"
                  onClick={() => {
                    if (onToggleServingOrTotal) {
                      onToggleServingOrTotal();
                    }
                  }}
                >
                  {t(servingOrTotal)}
                </Button>
              </Th>
              <Th isNumeric>{t('count')}</Th>
              <Th isNumeric>{t('mass')}</Th>
              <Th isNumeric>{t('energy')}</Th>
              <Th isNumeric>{t('fat')}</Th>
              <Th isNumeric>{t('carb')}</Th>
              <Th isNumeric>{t('protein')}</Th>
            </Tr>
          </Thead>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => fetchMore()}
            hasMore={!isExhausted}
            element="tbody"
          >
            {documents?.map((value: RxNPItemDocument) => (
              <ItemTableRow
                key={`${value.id}-itr`}
                document={value}
                priceType={servingOrTotal}
                onEdit={() => {
                  onEdit(value);
                }}
                onDelete={() => {
                  onDelete(value);
                }}
              />
            ))}
          </InfiniteScroll>
        </Table>
      </TableContainer>
      {documents?.length === 0 &&
        emptyStateText !== undefined &&
        !isFetching && (
          <Center pt="30vh">
            <Text color={subtleTextColor} align="center" px={3}>
              {emptyStateText}
            </Text>
          </Center>
        )}
    </>
  );
}
