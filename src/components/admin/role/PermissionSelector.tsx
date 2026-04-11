import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { IPermission } from "@/types/type";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getMethodColor } from "@/config/utils";

type Props = {
    value: IPermission[];
    onChange: (value: IPermission[]) => void;
    listPermissions: { module: string; permissions: IPermission[] }[];
};

const RolePermissionSelector = ({ value, onChange, listPermissions }: Props) => {
    const selectedPermissionIds = new Set(value.map(permission => permission.id));

    const handleSwitchChange = (perm: IPermission) => {
        const updatedPermissions = new Set(selectedPermissionIds);

        if (updatedPermissions.has(perm.id)) {
            updatedPermissions.delete(perm.id);
        } else {
            updatedPermissions.add(perm.id);
        }

        const updatedValues = listPermissions
            .flatMap(group => group.permissions)
            .filter(perm => updatedPermissions.has(perm.id));

        onChange(updatedValues);
    };

    const handleSwitchAll = (group: { module: string; permissions: IPermission[] }) => {
        const updatedPermissions = new Set(selectedPermissionIds);

        const allSelected = group.permissions.every(perm => updatedPermissions.has(perm.id));

        if (allSelected) {
            group.permissions.forEach((perm) => updatedPermissions.delete(perm.id));
        } else {
            group.permissions.forEach((perm) => updatedPermissions.add(perm.id));
        }

        const updatedValues = listPermissions
            .flatMap(group => group.permissions)
            .filter(perm => updatedPermissions.has(perm.id));

        onChange(updatedValues);
    };

    return (
        <FormItem>
            <FormLabel>Quyền</FormLabel>
            <ScrollArea className="h-[300px] pr-4">
                <Accordion type="multiple">
                    {listPermissions.map((group) => (
                        <AccordionItem key={group.module} value={group.module}>
                            <FormControl>
                                <AccordionTrigger>
                                    <Label className="font-bold">{group.module}</Label>
                                </AccordionTrigger>
                            </FormControl>
                            <Switch
                                className="ms-2"
                                checked={group.permissions.every(perm => selectedPermissionIds.has(perm.id))}
                                onCheckedChange={() => handleSwitchAll(group)}
                            />
                            <AccordionContent>
                                <div className="grid grid-cols-2 gap-3 m-2">
                                    {group.permissions.map((perm) => (
                                        <div key={perm.id}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Switch
                                                    checked={selectedPermissionIds.has(perm.id)}
                                                    onCheckedChange={() => handleSwitchChange(perm)}
                                                />
                                                <span>{perm.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500">
                                                    <span className={`${getMethodColor(perm.method)} me-2`}>{perm.method}</span>
                                                    {perm.apiPath}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
            <FormMessage />
        </FormItem>
    );
};

export default RolePermissionSelector;
