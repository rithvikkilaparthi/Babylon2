import BabylonViewer from "@/components/BabylonViewer";

export default function ViewerPage({ params }: { params: { modelName: string } }) {
  return <BabylonViewer modelName={params.modelName} />;
}