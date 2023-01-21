import React from "react";
import { Avatar, List, Progress } from "antd";

const Positions = () => {
  const data = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item actions={[<a key="list-loadmore-edit">Close</a>]}>
            <List.Item.Meta
              title={`Position #${index}: Inprogress`}
              description={
                <div>
                  <Progress
                    percent={99.9}
                    status="active"
                    strokeColor={{ from: "#108ee9", to: "#87d068" }}
                  />
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Positions;
