import { DataContext } from "./DataContext";

const DataProvider = ({ children }) => {
  const URL = "http://localhost:2201/api/"

  return (
    <DataContext.Provider value={{ URL }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;