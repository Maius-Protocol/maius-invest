import React from "react";
import { Avatar, List, Progress } from "antd";

const Positions = () => {
  const data = [
    {
      percent: 45,
      deposit: 200,
      end: "6:30PM January 23 2023",
      avg: 16.3,
    },
    {
      percent: 25,
      deposit: 100,
      end: "2:30AM January 27 2023",
      avg: 20.4,
    },
    {
      percent: 75,
      deposit: 100,
      end: "4:30AM January 22 2023",
      avg: 12.4,
    },
    {
      percent: 100,
      deposit: 150,
      avg: 14.2,
    },
  ];

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => {
          const done = item.percent !== 100;
          return (
            <List.Item
              actions={!done ? [] : [<a key="list-loadmore-edit">Pause</a>]}
            >
              <List.Item.Meta
                title={`Position #${index + 1}: ${done ? "Inprogess" : "Done"}`}
                description={
                  <div>
                    <div>Deposit: {item.deposit} USDC</div>
                    <div>End: {item.end}</div>
                    <div>Market Price: 25,4$/SOL</div>
                    <div>Avg Price: {item.avg}</div>
                    <Progress
                      percent={item.percent}
                      status={item.percent !== 100 ? "active" : "success"}
                      strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    />
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default Positions;
