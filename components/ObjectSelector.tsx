interface ObjectSelectorProps {
    setSelectedObject: (path: string) => void;
  }
  
  const OBJECTS = [
    { name: "Chair", path: "/models/chair.glb" },
    { name: "Table", path: "/models/table.glb" },
    { name: "Fire Extinguisher", path: "/models/extinguisher.glb" },
  ];
  
  export default function ObjectSelector({ setSelectedObject }: ObjectSelectorProps) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <h3>Select an Object:</h3>
        {OBJECTS.map((obj) => (
          <button
            key={obj.name}
            onClick={() => setSelectedObject(obj.path)}
            style={{ marginRight: "10px" }}
          >
            {obj.name}
          </button>
        ))}
      </div>
    );
  }
  