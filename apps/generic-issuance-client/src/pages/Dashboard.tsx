import {
  GenericIssuancePipelineListEntry,
  PipelineType,
  getError
} from "@pcd/passport-interface";
import { useStytch } from "@stytch/react";
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Link } from "react-router-dom";
import { PageContent, Table } from "../components/Core";
import { Header } from "../components/Header";
import {
  pipelineCreatedAt,
  pipelineIconFromStr,
  pipelineLastEdit,
  pipelineLink
} from "../components/PipelineDetails";
import { GIContext } from "../helpers/Context";
import { useFetchAllPipelines } from "../helpers/useFetchAllPipelines";
import { useFetchSelf } from "../helpers/useFetchSelf";
import { useJWT } from "../helpers/userHooks";

export default function Dashboard(): ReactNode {
  const stytchClient = useStytch();
  const userJWT = useJWT();
  const ctx = useContext(GIContext);
  const pipelinesFromServer = useFetchAllPipelines();
  const user = useFetchSelf();

  const isAdminView = ctx.isAdminMode && user?.value?.isAdmin;

  const pipelineEntries: GenericIssuancePipelineListEntry[] = useMemo(() => {
    if (!user?.value?.id) {
      return [];
    }

    const entries = pipelinesFromServer?.value ?? [];

    if (!isAdminView) {
      return entries.filter((e) => e.pipeline.ownerUserId === user.value.id);
    }

    return entries;
  }, [isAdminView, pipelinesFromServer?.value, user?.value?.id]);

  useEffect(() => {
    if (!userJWT) {
      window.location.href = "/";
    }
  }, [userJWT]);

  const maybeRequestError: string | undefined = getError(
    pipelinesFromServer,
    user
  );

  type Row = {
    status: "error" | "success" | "waiting";
    type: PipelineType;
    owner: string;
    timeCreated: string;
    timeUpdated: string;
    id: string;
  };

  const entryToRow = useCallback(
    (entry: GenericIssuancePipelineListEntry): Row => {
      return {
        status: !entry.extraInfo.lastRun
          ? "waiting"
          : entry.extraInfo.lastRun?.success
          ? "success"
          : "error",
        type: entry.pipeline.type,
        owner: entry.extraInfo.ownerEmail,
        timeCreated: entry.pipeline.timeCreated,
        timeUpdated: entry.pipeline.timeUpdated,
        id: entry.pipeline.id
      };
    },
    []
  );

  const rows: Row[] = useMemo(() => {
    return pipelineEntries.map(entryToRow);
  }, [entryToRow, pipelineEntries]);
  const columnHelper = createColumnHelper<Row>();
  const columns: Array<ColumnDef<Row> | undefined> = useMemo(
    () => [
      columnHelper.accessor("status", {
        header: "🚀",
        cell: (props) => {
          const value = props.getValue().valueOf() as
            | "waiting"
            | "success"
            | "error";
          return <span>{pipelineIconFromStr(value)}</span>;
        }
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (props) => {
          const value = props.getValue().valueOf();
          return <span>{value}</span>;
        }
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (props) => {
          const value = props.getValue().valueOf();
          return <span>{value}</span>;
        }
      }),
      isAdminView
        ? columnHelper.accessor("owner", {
            header: "Owner",
            cell: (props) => {
              const value = props.getValue().valueOf();
              return <span>{value}</span>;
            }
          })
        : undefined,
      columnHelper.accessor("timeCreated", {
        header: "Created",
        cell: (props) => {
          const value = props.getValue().valueOf();
          return <span>{pipelineCreatedAt(value)}</span>;
        }
      }),
      columnHelper.accessor("timeUpdated", {
        header: "Last Edited",
        cell: (props) => {
          const value = props.getValue().valueOf();
          return <span>{pipelineLastEdit(value)}</span>;
        }
      }),
      columnHelper.accessor("id", {
        header: "Link",
        cell: (props) => {
          const value = props.getValue().valueOf();
          return <span>{pipelineLink(value)}</span>;
        }
      })
    ],
    [columnHelper, isAdminView]
  );
  const filteredColumns = useMemo(() => {
    return columns.filter((r) => !!r) as Array<ColumnDef<Row>>;
  }, [columns]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns: filteredColumns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting
    },
    onSortingChange: setSorting
  });

  if (maybeRequestError) {
    return (
      <>
        <Header user={user} stytchClient={stytchClient} />
        <PageContent>
          <h2>Error Loading Page</h2>
          {maybeRequestError}
        </PageContent>
      </>
    );
  }

  if (!user || !pipelinesFromServer) {
    return (
      <>
        <Header user={user} stytchClient={stytchClient} />
        <PageContent>Loading...</PageContent>
      </>
    );
  }

  return (
    <>
      <Header user={user} stytchClient={stytchClient} />
      <PageContent>
        <h2>{isAdminView ? "" : "My "} Pipelines</h2>
        {!pipelineEntries?.length ? (
          <p>No pipelines right now - go create some!</p>
        ) : (
          <>
            <Table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => {
                      return (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                style: header.column.getCanSort()
                                  ? {
                                      cursor: "pointer"
                                    }
                                  : undefined,

                                onClick: header.column.getToggleSortingHandler()
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {i === 0
                                ? null
                                : {
                                    asc: " <",
                                    desc: " >"
                                  }[header.column.getIsSorted() as string] ??
                                  null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
        <div
          style={{
            marginTop: "16px"
          }}
        >
          <Link to="/create-pipeline">
            <button>Create Pipeline</button>
          </Link>
        </div>
      </PageContent>
    </>
  );
}